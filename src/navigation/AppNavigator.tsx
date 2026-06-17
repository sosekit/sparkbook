import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { EntryScreen } from '../screens/EntryScreen';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { SignInScreen } from '../screens/onboarding/SignInScreen';
import { CreateProfileScreen } from '../screens/onboarding/CreateProfileScreen';
import { ChooseInterestsScreen } from '../screens/onboarding/ChooseInterestsScreen';
import { FollowCreatorsScreen } from '../screens/onboarding/FollowCreatorsScreen';
import { HomeFeedScreen } from '../screens/HomeFeedScreen';
import { HomeMapScreen } from '../screens/HomeMapScreen';
import { CreateSparkScreen } from '../screens/CreateSparkScreen';
import { PostSparkOptionsScreen } from '../screens/PostSparkOptionsScreen';
import { SparkDetailScreen } from '../screens/SparkDetailScreen';
import { SingleSparkFromListScreen } from '../screens/SingleSparkFromListScreen';
import { SavedSparksScreen } from '../screens/SavedSparksScreen';
import { ListsScreen } from '../screens/ListsScreen';
import { CreateSparkListScreen } from '../screens/CreateSparkListScreen';
import { ListDetailScreen } from '../screens/ListDetailScreen';
import { SparkListPreviewScreen } from '../screens/SparkListPreviewScreen';
import { SavedListErrorScreen } from '../screens/SavedListErrorScreen';
import { GuideRouteScreen } from '../screens/GuideRouteScreen';
import { EndOfListExplorationScreen } from '../screens/EndOfListExplorationScreen';
import { BookmarksScreen } from '../screens/BookmarksScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CreatorProfileScreen } from '../screens/CreatorProfileScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { DeletedContentSuggestionScreen } from '../screens/DeletedContentSuggestionScreen';
import { EmptyLocationSuggestionScreen } from '../screens/EmptyLocationSuggestionScreen';
import { AddSparkToListScreen } from '../screens/AddSparkToListScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Entry" screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="Entry" component={EntryScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="CreateProfileOnboarding" component={CreateProfileScreen} />
        <Stack.Screen name="ChooseInterests" component={ChooseInterestsScreen} />
        <Stack.Screen name="FollowCreators" component={FollowCreatorsScreen} />
        <Stack.Screen name="HomeFeed" component={HomeFeedScreen} />
        <Stack.Screen name="HomeMap" component={HomeMapScreen} />
        <Stack.Screen name="CreateSpark" component={CreateSparkScreen} />
        <Stack.Screen name="PostSparkOptions" component={PostSparkOptionsScreen} />
        <Stack.Screen name="SparkDetail" component={SparkDetailScreen} />
        <Stack.Screen name="SingleSparkFromList" component={SingleSparkFromListScreen} />
        <Stack.Screen name="AddSparkToList" component={AddSparkToListScreen} />
        <Stack.Screen name="SavedSparks" component={SavedSparksScreen} />
        <Stack.Screen name="Lists" component={ListsScreen} />
        <Stack.Screen name="CreateSparkList" component={CreateSparkListScreen} />
        <Stack.Screen name="ListDetail" component={ListDetailScreen} />
        <Stack.Screen name="SparkListPreview" component={SparkListPreviewScreen} />
        <Stack.Screen name="SavedListError" component={SavedListErrorScreen} />
        <Stack.Screen name="GuideRoute" component={GuideRouteScreen} />
        <Stack.Screen name="EndOfListExploration" component={EndOfListExplorationScreen} />
        <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="CreatorProfile" component={CreatorProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="DeletedContentSuggestion" component={DeletedContentSuggestionScreen} />
        <Stack.Screen name="EmptyLocationSuggestion" component={EmptyLocationSuggestionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
