import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

data = pd.read_csv("data.csv")

data["features"] = data["categories"] + " " + data["level"]

tfidf = TfidfVectorizer()
features_matrix = tfidf.fit_transform(data["features"])
print(features_matrix)  # 중간에 벡터화된 데이터 출력

similarity_matrix = cosine_similarity(features_matrix)

item_index = 8 # 예시로 항목 2445를 선택
similar_items = list(enumerate(similarity_matrix[item_index]))
sorted_similar_items = sorted(similar_items, key=lambda x: x[1], reverse=True)[1:6]

for item in sorted_similar_items:
    print(data.iloc[item[0]])

