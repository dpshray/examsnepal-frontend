import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Player {
    id: number;
    name: string;
    corrected: number;
}

interface PlayersState {
    players: Player[];
}

const initialState: PlayersState = {
    players: [],
};

const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
        setPlayers(state, action: PayloadAction<Player[]>) {
            state.players = action.payload;
        },
        clearPlayers(state) {
            state.players = [];
        },
    },
});

export const {setPlayers, clearPlayers} = playersSlice.actions;

export default playersSlice.reducer;
