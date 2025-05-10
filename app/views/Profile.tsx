import { NavigationProp, useNavigation } from "@react-navigation/native";
import colors from "@utils/colors";
import size from "@utils/size";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { ProfileNavigatorParamList } from "app/navigator/ProfileNavigator";
import useClient from "hooks/useClient";
import { useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ProfileRes } from "app/navigator";
import useAuth from "app/hooks/useAuth";
import { useDispatch } from "react-redux";
import { updateAuthState } from "app/store/auth";
import { showMessage } from "react-native-flash-message";
import { AntDesign } from "@expo/vector-icons";
import FormDivider from "@ui/FormDivider";
import AvatarView from "@ui/AvatarView";
import { selectImages } from "@utils/helper";
import mime from "mime";
import ProfileOptionListItem from "@components/ProfileOptionListItem";
import LoadingSpinner from "@ui/LoadingSpinner";

export default function Profile() {

    const { navigate } = useNavigation<NavigationProp<ProfileNavigatorParamList>>();
    const { authState, signOut } = useAuth();
    const { authClient } = useClient();
    const { profile } = authState;
    const dispatch = useDispatch();

    const [userName, setUserName] = useState(profile?.name || "");
    const [busy, setBusy] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [updatingAvatar, setUpdatingAvatar] = useState(false);


    // 1. 이름 변경 여부 확인 (사용자가 입력한 이름(userName)이 기존 프로필 이름(profile.name)과 다르고, 최소 3자 이상이면 true)
    const isNameChanged = profile?.name !== userName && userName.trim().length >= 3;

    const onMessagePress = () => {
        navigate("Chats");
    };

    const onListingPress = () => {
        navigate("Listings");
    };


    // 2. 프로필 새로고침 (pull-to-refresh 시 사용)
    const fetchProfile = async () => {
        setRefreshing(true);
        const res = await runAxiosAsync<{ profile: ProfileRes }>(
            authClient.get("/auth/profile")
        );
        setRefreshing(false);
        if (res) {
            dispatch(
                updateAuthState({
                    profile: { 
                        ...profile!, 
                        ...res.profile 
                    },
                    pending: false,
                })
            );
        }
    }


    // 3. 이름 수정 API 호출
    const updateProfile = async () => {
        const res = await runAxiosAsync<{ profile: ProfileRes }>(
            authClient.patch("/auth/update-profile", { name: userName })
        );
        if (res) {
            showMessage({ message: "Name updated successfully.", type: "success" });
            dispatch(
                updateAuthState({
                    pending: false,
                    profile: { 
                        ...profile!, 
                        ...res.profile 
                    },
                })
            );
        }
    }

    // 4. 이메일 인증 링크 재요청 API 호출
    const getVerificationLink = async () => {
        setBusy(true);
        const res = await runAxiosAsync<{ message: string }>(
            authClient.get("/auth/verify-token")
        );
        setBusy(false);
        if (res) {
            showMessage({ message: res.message, type: "success" });
        }
    }


    // 5. 프로필 이미지 선택 및 업로드 API 호출
    const handleProfileImageSelection = async () => {
        const [image] = await selectImages({
            allowsMultipleSelection: false,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (image) {
            const formData = new FormData();
            formData.append("avatar", {
                name: "Avatar",
                uri: image,
                type: mime.getType(image),
            } as any);

            setUpdatingAvatar(true);
            const res = await runAxiosAsync<ProfileRes>(
                authClient.patch("/auth/update-avatar", formData)
            );
            setUpdatingAvatar(false);
            if (res) {
                dispatch(
                    updateAuthState({
                        profile: { 
                            ...profile!, 
                            ...res.profile 
                        },
                        pending: false,
                    })
                );
            }
        }
    };


    return (
        <ScrollView
            refreshControl={
                <RefreshControl 
                    refreshing={refreshing} 
                    onRefresh={fetchProfile} 
                />
            }
            contentContainerStyle={styles.container}
        >

            {/* 이메일 인증 안내 메시지 */}
            {!profile?.verified && (
                <View style={styles.verificationLinkContainer}>
                    <Text style={styles.verificationTitle}>
                        It look like your profile is not verified.
                    </Text>
                    {busy ? (
                        <Text style={styles.verificationLink}>Please Wait...</Text>
                    ) : (
                        <Text onPress={getVerificationLink} style={styles.verificationLink}>
                            Tap here to get the link.
                        </Text>
                    )}
                </View>
            )}

            {/* 프로필 이미지 + 이름/이메일 정보 */}
            <View style={styles.profileContainer}>
                <AvatarView 
                    uri={profile?.avatar}
                    size={80}
                    onPress={handleProfileImageSelection}
                />
                
                <View style={styles.profileInfo}>
                    <View style={styles.nameContainer}>
                        <TextInput
                            value={userName}
                            onChangeText={(text) => setUserName(text)}
                            style={styles.name}
                        />
                        {isNameChanged && (
                            <Pressable onPress={updateProfile}>
                                <AntDesign name="check" size={24} color={colors.primary} />
                            </Pressable>
                        )}
                    </View>
                    <Text style={styles.email}>{profile?.email}</Text>
                 </View>
            </View>

            <FormDivider />

            {/* 프로필 메뉴 항목들 (메시지 / 게시물 / 로그아웃) */}
            <ProfileOptionListItem
                style={styles.marginBottom}
                antIconName="message1"
                title="Messages"
                onPress={onMessagePress}
            />
            <ProfileOptionListItem
                style={styles.marginBottom}
                antIconName="appstore-o"
                title="Your Listings"
                onPress={onListingPress}
            />
            <ProfileOptionListItem
                antIconName="logout"
                title="Log out"
                onPress={signOut}
            />

            {/* 이미지 업데이트 로딩 스피너 */}
            <LoadingSpinner visible={updatingAvatar} />
           
        </ScrollView>
    )
}

const styles = StyleSheet.create({
  verificationLinkContainer: {
    padding: 10,
    backgroundColor: colors.deActive,
    marginVertical: 10,
    borderRadius: 5,
  },
  verificationTitle: {
    fontWeight: "600",
    color: colors.primary,
    textAlign: "center",
  },
  verificationLink: {
    fontWeight: "600",
    color: colors.active,
    textAlign: "center",
    paddingTop: 5,
  },
  container: {
    padding: size.padding,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
    paddingLeft: size.padding,
  },
  name: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    color: colors.primary,
    paddingTop: 2,
  },
  marginBottom: {
    marginBottom: 15,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});