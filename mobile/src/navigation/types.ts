import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
};

export type LawnAreasStackParamList = {
  LawnAreasList: undefined;
  LawnAreaDetail: { lawnAreaId: string };
  AddLawnArea: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  LawnAreasTab: NavigatorScreenParams<LawnAreasStackParamList>;
  LogMow: { lawnAreaId?: string } | undefined;
  History: undefined;
  Reports: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

declare global {

  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
