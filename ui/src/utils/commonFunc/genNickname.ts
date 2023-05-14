import nicknameData from "@/utils/dummyData/randomNickname";

export const generateNickname = () => {
  const { prefix, surfix } = nicknameData;
  const pre = prefix[Math.floor(Math.random() * prefix.length)];
  const sur = surfix[Math.floor(Math.random() * surfix.length)];
  const nickname = `${pre} ${sur}`;

  return nickname;
};
