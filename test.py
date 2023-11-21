import pandas as pd
import mysql.connector

db_config = {
    'host': '142.93.204.108',
    'user': 'interns',
    'password': 'Mega!@#2050',
    'database': 'DataAnalytics'
}

conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

csv_file =  r'C:\Users\joy gichure\Desktop\stockout-analysis\SampleData.csv'
data = pd.read_csv(csv_file)
data_count = len(data)
count = 1

for index, row in data.iterrows():
    count += 1
    query = "INSERT INTO sales_data (branch,item_code,item_name,doc_date,qty_in,qty_out) VALUES (%s, %s, %s,%s, %s, %s)"
    values = (row['Branch'],row['ItemCode'],row['ItemName'],row['Date'],row['QtyIN'],row['QtyOUT'])
    # print(query, values)
    cursor.execute(query, values)
    print(f'Done {count} out of {data_count}')

conn.commit()
conn.close()
 
print("Data inserted into MySQL successfully.")
# print(data)

