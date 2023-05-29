import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

script_dir = os.path.dirname(__file__)
rel_path = "./data.csv"
data = pd.read_csv(os.path.join(script_dir, rel_path))

data["features"] = data["categories"] + " " + data["level"]

tfidf = TfidfVectorizer()
features_matrix = tfidf.fit_transform(data["features"])
# print(features_matrix)  # 중간에 벡터화된 데이터 출력

similarity_matrix = cosine_similarity(features_matrix)

item_number = int(input())  # input으로 들어온 문제 선택
item_index = data[data["number"] == item_number].index[0]
similar_items = list(enumerate(similarity_matrix[item_index]))
sorted_similar_items = sorted(similar_items, key=lambda x: x[1], reverse=True)[1:6]

for item in sorted_similar_items:
    similar_number = data.iloc[item[0]]["number"]
    print(similar_number)