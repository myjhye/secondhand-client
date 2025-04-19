import { createBottomTabNavigator, BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import AppNavigator from "./AppNavigator";
import { AntDesign } from "@expo/vector-icons";
import NewListing from "@views/NewListing";
import ProfileNavigator from "./ProfileNavigator";

const Tab = createBottomTabNavigator(); // 하단 탭 네비게이터 생성

// 아이콘 설정
const getOptions = (iconName: string): BottomTabNavigationOptions => {
    return {
        tabBarIcon({ color, size }) {
            return <AntDesign name={iconName as any} size={size} color={color} />; // 아이콘 렌더링
        },
        title: "", // 탭 아래 텍스트 제거
    };
};

export default function TabNavigator() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="HomeNavigator"
                component={AppNavigator}
                options={getOptions("home")}
            />
            <Tab.Screen
                name="NewListing"
                component={NewListing}
                options={getOptions("pluscircleo")}
            />
            <Tab.Screen
                name="ProfileNavigator"
                component={ProfileNavigator}
                options={getOptions("user")}
            />
        </Tab.Navigator>
    )
}