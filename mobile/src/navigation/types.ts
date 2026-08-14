import { NavigatorScreenParams } from '@react-navigation/native';

// Bottom Tab params
export type TabParamList = {
  HomeTab: undefined;
  TreeTab: undefined;
  NewsTab: undefined;
  EventsTab: undefined;
  MoreTab: undefined;
};

// Home stack
export type HomeStackParamList = {
  Home: undefined;
  NewsDetails: { id: string };
  EventDetails: { id: string };
};

// News stack
export type NewsStackParamList = {
  NewsList: undefined;
  NewsDetails: { id: string };
};

// Events stack
export type EventsStackParamList = {
  EventsList: undefined;
  EventsCalendar: undefined;
  EventDetails: { id: string };
};

// Tree stack
export type TreeStackParamList = {
  FamilyTree: { rootPersonId?: string };
  TreeSearch: undefined;
  PersonProfile: { id: string };
  BranchesDirectory: undefined;
};

// More stack
export type MoreStackParamList = {
  More: undefined;
  Suggestions: undefined;
  SubmissionSuccess: { ticketNumber: string };
};

// Root
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<TabParamList>;
};
