import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
}

interface Chat {
  text: string;
  time: string;
  id: string;
  viewed: boolean;
  user: UserProfile;
}

export interface Conversation {
  id: string;
  chats: Chat[];
  peerProfile: { 
    avatar?: string; 
    name: string; 
    id: string 
  };
}

type UpdatePayload = {
  chat: Chat;
  conversationId: string;
  peerProfile: UserProfile;
};

interface InitialState {
  conversations: Conversation[];
}

const initialState: InitialState = {
  conversations: [],
};

const slice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        updateConversation(
            { conversations },
            { payload }: PayloadAction<UpdatePayload>
        ) {
            const index = conversations.findIndex(
                ({ id }) => id === payload.conversationId
            );

            if (index === -1) {
                conversations.push({
                    id: payload.conversationId,
                    chats: [payload.chat],
                    peerProfile: payload.peerProfile,
                });
            }
            else {
                conversations[index].chats.push(payload.chat);
            }
        }
    }
})

export const { updateConversation } = slice.actions;

export const selectConversationById = (conversationId: string) => {
  return createSelector(
    (state: RootState) => state,
    ({ conversation }) => {
      return conversation.conversations.find(({ id }) => id === conversationId);
    }
  );
};


export default slice.reducer;