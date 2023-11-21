import pandas as pd
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from pyngrok import ngrok

app = Flask(__name__)
# CORS(app, resources={r"/get_data": {"origins": "http://127.0.0.1:5500"}})
# CORS(app)


@app.route('/get_data', methods=['GET'])
def get_data():
    try:
        # data = request.get_json()
        # startDate = data['startDate']
        # endDate = data['endDate']
        # branch = data['branch']
        # itemCode = data['itemCode']

        startDate = "2023-01-01"
        endDate = "2023-01-30"
        branch = "DAN002"
        itemCode = "SAL009"

        excel_file_path = r'C:\Users\joy gichure\Downloads\Sample Data S00062.xlsx'

        dataset = pd.read_excel(excel_file_path)
        dataset['Document Date'] = pd.to_datetime(dataset['Document Date'], dayfirst=True)
        rs = dataset[
            (dataset['Branch'] == branch) &
            (dataset['Item Code'] == itemCode)
        ]
        rs = rs.sort_values(by=['Document Date'])
        rs['Document Date'] = pd.to_datetime(rs['Document Date'], format='%d/%m/%Y')
        rs['Running Stock'] = rs['Total Qty IN'] - rs['Total Qty OUT']
        rs['Running Stock'] = rs.groupby(['Branch','Item Code'])['Running Stock'].cumsum()
        rs['Days Between'] = rs['Document Date'].diff().dt.days

        filtered_rs = rs[rs['Running Stock'] <= 0]

        sum_days_between = filtered_rs['Days Between'].sum()

        selected_fields = ['Branch', 'Days Between','Date Day','Date Month','Date Year','Document Date', 'Item Code', 'Item Name', 'Total Qty IN', 'Total Qty OUT', 'Running Stock']
        d1f = rs[rs['Document Date'] >= startDate]
        d2f = d1f[d1f['Document Date'] <= endDate]

        result = d2f.to_dict(orient='records')

        ctime = datetime.now()
        formatted_time = ctime.strftime("%Y-%m-%d_%H-%M-%S")
        output_file = f'{itemCode}_output_data_{formatted_time}.xlsx'
        rs.to_excel(output_file)

        return jsonify({
            "File Upload": output_file,
            "Out OF Stock Days": float(sum_days_between),
            "data": result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)

port = 5000
public_url = ngrok.connect(addr=port)
print('ngrok is active at:', public_url)
