import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Image } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { AppStackParamList } from "app/navigator/AppNavigator";
import colors from "@utils/colors";
import useClient from "hooks/useClient";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { Feather } from "@expo/vector-icons";

type AskAiRouteProp = RouteProp<AppStackParamList, "AskAi">;

export default function AskAi() {
  const { params } = useRoute<AskAiRouteProp>();
  const { title, price, description, thumbnail } = params;

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ from: "user" | "ai"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const { authClient } = useClient();

  const handleSend = async () => {
    if (!question.trim()) return;

    const userMessage = { 
        from: "user" as const, 
        content: question 
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    const res = await runAxiosAsync<{ answer: string }>(
        authClient.post("/product/ask-ai", {
        title,
        price,
        description,
        question,
        })
    );

    setLoading(false);

    if (res?.answer) {
        const aiMessage = { 
            from: "ai" as const, 
            content: res.answer 
        };
        setMessages((prev) => [...prev, aiMessage]); // 답변 추가
    } else {
        setMessages((prev) => [
        ...prev,
        { from: "ai", content: "죄송합니다. 답변을 불러오는 데 실패했습니다." },
        ]);
    }
  };


  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: "padding", android: undefined })}
        keyboardVerticalOffset={80}
    >
        <View style={styles.header}>
            <Image source={{ uri: thumbnail || undefined }} style={styles.thumbnail} />
            <Text style={styles.title}>{title}</Text>
        </View>

        <View style={{ flex: 1 }}>
            <ScrollView
            style={styles.chatArea}
            contentContainerStyle={{ paddingBottom: 16 }}
            keyboardShouldPersistTaps="handled"
            >
            {messages.map((msg, idx) => (
                <View
                key={idx}
                style={[
                    styles.messageBubble,
                    msg.from === "user" ? styles.userBubble : styles.aiBubble,
                ]}
                >
                <Text
                    style={[
                        styles.messageText,
                        msg.from === "user" && { color: "#ffffff" },
                    ]}
                >
                    {msg.content}
                </Text>

                </View>
            ))}
            {loading && (
                <View style={[styles.messageBubble, styles.aiBubble]}>
                <Text style={styles.messageText}>답변 작성 중...</Text>
                </View>
            )}
            </ScrollView>

            {/* 하단 입력창 */}
            <View style={styles.inputContainer}>
            <TextInput
                value={question}
                onChangeText={setQuestion}
                placeholder="AI에게 질문해 보세요"
                style={styles.input}
                multiline
            />
            <Pressable style={styles.sendBtn} onPress={handleSend}>
                <Feather name="send" size={20} color={colors.white} />
            </Pressable>
            </View>
        </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row", // 가로 정렬
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.primary,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: "#ccc", // 이미지 없을 경우 배경색
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
    flexShrink: 1, // 긴 텍스트 줄바꿈
  },
  subtitle: {
    fontSize: 14,
    color: "#E0E0E0",
    marginTop: 4,
  },
  chatArea: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 6,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#e3dcdc",
  },
  messageText: {
    color: colors.text,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    color: colors.text,
  },
  sendBtn: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
