from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import mysql.connector
import logging

app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {"origins": ["http://localhost:5173", "http://localhost:5174"]}},
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="vehicle_breakdown"
        )
        if conn.is_connected():
            logger.info("✅ MySQL connected successfully")
        return conn
    except mysql.connector.Error as err:
        logger.error(f"❌ MySQL connection failed: {err}")
        return None

# ✅ Run DB test BEFORE starting Flask
def test_db_connection():
    conn = get_db_connection()
    if conn and conn.is_connected():
        logger.info("✅ Initial DB test: Connected")
        conn.close()
    else:
        logger.error("❌ Initial DB test: Failed to connect")

# -----------------------------
#  Routes (unchanged)
# -----------------------------
@app.route('/car_owner', methods=['GET'])
def get_car_owners():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM car_owner")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(rows)

# ... your other CRUD routes ...
@app.route('/api/user-submit', methods=['POST'])
def user_submit():
    data = request.json
    role = data.get("role")

    logger.info(f"Received form submission for role: {role}")

    if role == "owner":
        name = data.get("name")
        mobile = data.get("mobile")
        email = data.get("email")
        password = data.get("password")

        try:
            conn = get_db_connection()
            if not conn:
                return jsonify({"success": False, "error": "Database connection failed"}), 500

            cursor = conn.cursor()

            check_mobile = "SELECT * FROM car_owner WHERE CO_Mobile_No = %s"
            cursor.execute(check_mobile, (mobile,))
            existing = cursor.fetchone()

            check_email = "SELECT * FROM car_owner WHERE CO_Email = %s"
            cursor.execute(check_email, (email,))
            existing = cursor.fetchone()

            if existing:
                logger.warning(f"❌ Email Address already exists.")
                return jsonify({"success": False, "error": "Email Address already exists. Please use a different Email Address."}), 400

            query = """
                INSERT INTO car_owner (CO_Name, CO_Mobile_No, CO_Email, CO_Password)
                VALUES (%s, %s, %s, %s)
            """
            values = (name, mobile, email, password)

            cursor.execute(query, values)
            conn.commit()

            new_id = cursor.lastrowid
            cursor.close()
            conn.close()

            logger.info(f"✅ Car Owner added with ID: {new_id}")

            return jsonify({
                "success": True,
                "message": "Car Owner details saved successfully.",
                "id": new_id
            })

        except Exception as e:
            logger.error(f"❌ Error inserting Car Owner: {e}")
            return jsonify({"success": False, "error": str(e)}), 500

    elif role == "mechanic":
        name = data.get("name")
        mobile = data.get("mobile")
        email = data.get("email")
        password = data.get("password")
        garage_name = data.get("garageName")
        garage_desc = data.get("garageDescription")
        latitude = data.get("latitude")
        longitude = data.get("longitude")

        if not all([name, mobile, email, password, garage_name, latitude, longitude]):
            return jsonify({
                "success": False,
                "error": "Missing required fields for Mechanic."
            }),400
        try:
            conn = get_db_connection()
            if not conn:
                return jsonify({"success": False, "error": "Database connection failed"}), 500
            
            cursor = conn.cursor()
            cursor.execute(
                "select 1 from mechanic where MN_Email = %s",
                (email,)
            )
            if cursor.fetchone():
                return jsonify({
                    "success": False,
                    "error": "Email Address already exists. Please use a different Email Address."
                })
            query = """
                INSERT INTO mechanic
                (MN_Name, MN_Mobile, MN_Email, MN_Password,
                 MN_Garage_Name, MN_Garage_Desc, Latitude, Longitude)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (
                name,
                mobile,
                email,
                password,
                garage_name,
                garage_desc,
                latitude,
                longitude
            )

            cursor.execute(query, values)
            conn.commit()

            new_id = cursor.lastrowid
            cursor.close()
            conn.close()

            logger.info(f"✅ Mechanic added with ID: {new_id}")

            return jsonify({
                "success": True,
                "message": "Mechanic registered successfully",
                "id": new_id
            })

        except Exception as e:
            logger.error(f"❌ Error inserting mechanic: {e}")
            return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/login", methods=["POST", "OPTIONS"])
@cross_origin(origin="http://localhost:5173")
def login():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.json
    role = data.get("role")
    email = data.get("email")
    password = data.get("password")

    conn = get_db_connection()
    if not conn:
        return jsonify({"success": False, "error": "DB connection failed"}), 500

    cursor = conn.cursor(dictionary=True)

    try:
        if role == "owner":
            cursor.execute(
                "SELECT * FROM car_owner WHERE CO_Email=%s AND CO_Password=%s",
                (email, password)
            )
            user = cursor.fetchone()
        # else:
        #     return jsonify({"success": False, "error": "Invalid role"}), 400
        
        elif role == "mechanic":
            cursor.execute(
                "SELECT * FROM mechanic WHERE MN_Email=%s AND MN_Password=%s",
                (email, password)
            )
            user = cursor.fetchone()
        else:
            return jsonify({"success": False, "error": "Invalid role"}), 400
        
    except Exception as e:
        logger.error(e)
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

    if not user:
        return jsonify({"success": False, "error": "Invalid credentials"}), 401

    return jsonify({"success": True, "name": user.get("CO_Name") or user.get("MN_Name")}), 200

@app.route("/api/mechanics", methods=["GET"])
def get_mechanics():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT 
            MN_Name,
            MN_Garage_Name,
            MN_Mobile,  
            Latitude,
            Longitude
        FROM mechanic
        WHERE Latitude IS NOT NULL AND Longitude IS NOT NULL
    """)
    mechanics = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(mechanics), 200

if __name__ == '__main__':
    test_db_connection()   # ✅ Run test here
    app.run(debug=True)
