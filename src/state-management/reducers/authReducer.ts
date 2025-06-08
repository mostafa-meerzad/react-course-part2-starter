interface Login {
  type: "LOGIN";
  userName: string;
}

interface Logout {
  type: "LOGOUT";
}

type ActionType = Login | Logout;

const authReducer = (state: string, action: ActionType): string => {
  switch (action.type) {
    case "LOGIN":
      return action.userName;
    case "LOGOUT":
      return "";
    default:
      return state;
  }
};

export default authReducer;