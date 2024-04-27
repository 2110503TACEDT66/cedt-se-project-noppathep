import getUserProfile from "./libs/user/getUserProfile";
import updateCard from "./libs/user/updateCard";

export interface Creditcard {
    id: string;
    cardNumber: string;
    cardHolder: string;
    cardMonth: string;
    cardYear: string;
    cardCvv: string;
  }
  export interface AddEditCard extends Creditcard {
    isCardFlipped: boolean;
  }