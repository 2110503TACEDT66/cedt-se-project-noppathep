'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Creditcard,fetchCreditCardList } from '../../Creditcard';
import CreditCardBox from './CardFunction';
import Row from 'react-bootstrap/Row';
import { Button, Col, Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter

export default function Cards() {
  const [cardsData, setCardsData] = useState<Creditcard[]>([]);
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const cards: Creditcard[] = await fetchCreditCardList();
    setCardsData(cards);
  }

  return (
    <Router>
      <>
        <h1 className="home-page-heading">Your Cards</h1>
        <Container>
          <Row className="justify-content-center">
            {cardsData.length === 0 && (
              <>
                <Card style={{ width: '50%', margin: '25px' }}>
                  <Card.Body>
                    <Card.Title>No card exist</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Go to add card for create a new card.
                    </Card.Subtitle>
                    <Card.Text>
                      You can add,edit and delete card any time..
                    </Card.Text>
                    <Link href="/credit">Add Card</Link>
                  </Card.Body>
                </Card>
              </>
            )}
            {cardsData.map((card: Creditcard, id) => (
              <Col md={4} key={id} className="mb-3">
                <Link
                  key={id}
                  href={`/Editcard/${card.id}`}
                  className="col-md-3 credit-card"
                >
                  <CreditCardBox
                    cardNumber={card.cardNumber}
                    cardHolder={card.cardHolder}
                    cardMonth={card.cardMonth}
                    cardYear={card.cardYear}
                    cardCvv={card.cardCvv}
                    isCardFlipped={false}
                  ></CreditCardBox>
                </Link>
              </Col>
            ))}
          </Row>
          <Row className="justify-content-center">
            <Col md={4} className="mt-3">
              <Link href={'/credit'}>
                <Button
                  className="add-new-card"
                  variant='primary'
                  size="lg"
                >
                  Add New Card
                </Button>{' '}
              </Link>
            </Col>
          </Row>
        </Container>
      </>
    </Router>
  );
}
