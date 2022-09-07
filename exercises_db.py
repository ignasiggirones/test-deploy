import pandas as pd

data = pd.read_csv('db/exercises_db2.csv')
df = pd.DataFrame(data)

for i in range(1, len(data.columns) - 1):
    df[data.columns[i]] = df[data.columns[i]].str.lower()

df.to_json('db/exercises_db2.json', orient='records')
