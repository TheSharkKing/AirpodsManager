from flask import Flask, send_from_directory, request, jsonify
import os

app = Flask(__name__, static_folder="airpods-manager/public")

# Serve the React UI
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

# Endpoint to toggle transparency mode
@app.route("/api/transparency", methods=["POST"])
def toggle_transparency():
    data = request.json
    enabled = data.get("enabled", False)
    # Logic to enable/disable transparency mode
    # Replace with actual implementation
    return jsonify({"status": "success", "transparency": enabled})

# Endpoint to toggle noise cancellation
@app.route("/api/noise-cancellation", methods=["POST"])
def toggle_noise_cancellation():
    data = request.json
    enabled = data.get("enabled", False)
    # Logic to enable/disable noise cancellation
    # Replace with actual implementation
    return jsonify({"status": "success", "noiseCancellation": enabled})

if __name__ == "__main__":
    app.run(debug=True)