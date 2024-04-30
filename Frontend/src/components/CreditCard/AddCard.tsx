'use client'
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Card from './CardFunction';
import CardForm from './CardForm';
import { Creditcard } from '../../Creditcard';
import updateCard from '@/libs/user/updateCard';
import { useSession } from 'next-auth/react';
import getUserProfile from '@/libs/user/getUserProfile';

const initialState: Creditcard = {
  id: '',
  cardNumber: '',
  cardHolder: '',
  cardMonth: '',
  cardYear: '',
  cardCvv: '',
};

export default function AddCard() {
  const { data: session, status } = useSession();
  
  const [profile, setProfile] = useState<any>();
  const [state, setState] = useState<Creditcard>(initialState);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const fetchProfile = await getUserProfile(session!.user.token);

      setProfile(fetchProfile);
    }

    fetchData()
  }, [])

  const updateStateValues = useCallback(
    (keyName: keyof Creditcard, value: string) => {
      setState({
        ...state,
        [keyName]: value || '',
      });
    },
    [state],
  );

  async function handleSubmitAction () {
    try {
      let newCardsList: Creditcard[] = [];

      if (profile)
        newCardsList = profile.data.card;

      newCardsList.push({
        ...state,
        id: uuid(),
      });
      updateCard(session!.user.token, newCardsList);
    } catch (error: any) {
      alert(error);
      console.log(error);
    } finally {
      window.location.href = '/yourcard';
    }
  }

  return (
    <Fragment>
      <div className="add-card-content">
        <div className="wrapper">
          <CardForm
            selectedCreditCard={state}
            onUpdateState={updateStateValues}
            setIsCardFlipped={setIsCardFlipped}
            handleSubmitAction={handleSubmitAction}
          >
            <Card
              cardNumber={state.cardNumber}
              cardHolder={state.cardHolder}
              cardMonth={state.cardMonth}
              cardYear={state.cardYear}
              cardCvv={state.cardCvv}
              isCardFlipped={isCardFlipped}
            ></Card>
          </CardForm>
        </div>
      </div>
    </Fragment>
  );
}
