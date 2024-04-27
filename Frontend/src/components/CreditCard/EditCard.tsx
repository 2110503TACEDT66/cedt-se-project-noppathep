  'use client'
  import React, { Fragment, useCallback, useEffect, useState } from 'react';
  import { Button, Col, Container, Row } from 'react-bootstrap';
  import { useSession } from 'next-auth/react';
  import Card from './CardFunction';
  import CardForm from './CardForm';
  import {
    Creditcard,
  } from '../../Creditcard';
  import Link from 'next/link';
import updateCard from '@/libs/user/updateCard';
import getUserProfile from '@/libs/user/getUserProfile';

  const initialState: Creditcard = {
    id: '',
    cardNumber: '',
    cardHolder: '',
    cardMonth: '',
    cardYear: '',
    cardCvv: '',
  };

  export default function EditCard() {
    const { data: session, status } = useSession();

    const path = window.location.pathname; // Get the current path
    const segments = path.split('/'); // Split the path into segments
    const idSegmentIndex = segments.indexOf('Editcard') + 1; // Find the index of 'Editcard' and add 1 to get the index of the id
    const id = segments[idSegmentIndex]; // Extract the id from the segment
    const parmId = id
    const [state, setState] = useState<Creditcard>(initialState);
    const [cardsData, setCardsData] = useState<Creditcard[]>([]);
    const [isCardFlipped, setIsCardFlipped] = useState(false);
  
    useEffect(() => {
      fetchData();
    }, [parmId]);
  
    async function fetchData() {
      const profile = await getUserProfile(session!.user.token);
      
      const cards: Creditcard[] = profile.data.card;
      setCardsData(cards);
      if (cards && cards.length > 0) {
        const selectedCard = cards.find((card) => card.id === parmId);
        setState(selectedCard ?? initialState);
      }
    }

    const updateStateValues = useCallback(
      (keyName: keyof Creditcard, value: string) => {
        setState({
          ...state,
          [keyName]: value || '',
        });
      },
      [state],
    );

    function handleSubmitAction() {
      try {
        const cards: Creditcard[] = cardsData;
        const selectedCard: Creditcard =
          cards.find((card) => card.id === parmId) ?? initialState;
        const selectedCardIndex = cards.indexOf(selectedCard);
        cards[selectedCardIndex] = state;
        updateCard(session!.user.token, cards);
      } catch (error: any) {
        alert(error);
        console.log(error);
      } finally {
        //release resources or stop loader
      }
    }
    

    function handleDeleteAction() {
      try {
        console.log("parmId:", parmId); // Log parmId to the console
        if (confirm('Are you sure you want to delete this card?') === false) {
          return;
        }
    
      const cards: Creditcard[] = cardsData;
      const selectedCard: Creditcard =
        cards.find((card) => card.id === parmId) ?? initialState;
      const selectedCardIndex = cards.indexOf(selectedCard);
      cards.splice(selectedCardIndex, 1);
      updateCard(session!.user.token, cards);
      } catch (error: any) {
        alert(error);
        console.log(error);
      } finally {
        // Release resources or stop loader
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
        <Container>
          <Row className="justify-content-center">
            <Col md={3} className="">
            <Link href="/yourcard">
              <div className="d-grid gap-1 delete-card">
                  <Button variant="link" size="lg" onClick={handleDeleteAction}>
                    Delete Card
                  </Button>{' '}
              </div>
            </Link>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }