from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import logging

app = Flask(__name__)
CORS(app)

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

    else:
        return jsonify({"success": False, "error": "Invalid role"}), 400

if __name__ == '__main__':
    test_db_connection()   # ✅ Run test here
    app.run(debug=True)
