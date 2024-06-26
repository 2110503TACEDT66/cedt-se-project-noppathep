import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Creditcard } from '../../Creditcard';
import Link from 'next/link';

const currentYear = new Date().getFullYear();
const monthsArr = Array.from({ length: 12 }, (x, i) => {
  const month = i + 1;
  return month <= 9 ? '0' + month : month;
});
const yearsArr = Array.from({ length: 9 }, (_x, i) => currentYear + i);

interface CardFormProps {
  selectedCreditCard: Creditcard;
  onUpdateState: any;
  setIsCardFlipped: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmitAction: () => void;
  children: any;
}

export default function CardForm(props: CardFormProps) {
  const {
    selectedCreditCard,
    onUpdateState,
    setIsCardFlipped,
    handleSubmitAction,
    children,
  } = props;
  const [errors, setErrors] = useState<Creditcard>({
    id: '',
    cardNumber: '',
    cardHolder: '',
    cardMonth: '',
    cardYear: '',
    cardCvv: '',
  });

  const handleFormChange = (event: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = event.target;

    onUpdateState(name, value);
  };

  const handleFormChangeNumbers = (event: {
    target: { value: string; name: string };
  }) => {
    const { name, value } = event.target;
    if (isNaN(Number(value))) return; //only accept numbers
    onUpdateState(name, value);
  };

  const onCvvFocus = () => {
    setIsCardFlipped(true);
  };

  const onCvvBlur = () => {
    setIsCardFlipped(false);
  };

  const handleConfirmAction = (e: any) => {
    // validate errors
    if (!isFormHasErrors()) {
      handleSubmitAction();
      // window.location.href = "/yourcard";
    }
  };

  const isFormHasErrors = () => {
    const newErrors: Creditcard = {
      id: '',
      cardNumber: '',
      cardHolder: '',
      cardMonth: '',
      cardYear: '',
      cardCvv: '',
    };

    //first validate blank fields
    let isErrorFlag = false;
    Object.keys(newErrors).forEach(function (key: any) {
      const keyPair = key as keyof Creditcard;
      const displayableKeyName = key.toLowerCase().replace('card', 'Card ');
      if (!selectedCreditCard[keyPair]) {
        newErrors[keyPair] = `${displayableKeyName} value required.`;
        isErrorFlag = true;
      } else {
        newErrors[keyPair] = '';
        isErrorFlag = false;
      }
    });

    if (isErrorFlag) {
      setErrors(newErrors);
      return isErrorFlag;
    }

    //if no blank field then check other validation
    if (selectedCreditCard['cardNumber'].length !== 16) {
      newErrors.cardNumber = 'Card number should be 16 digits';
      isErrorFlag = true;
    }
    if (selectedCreditCard['cardCvv'].length !== 3) {
      newErrors.cardCvv = 'Card number should be 3 digits';
      isErrorFlag = true;
    }
    setErrors(newErrors);
    return isErrorFlag;
  };

  return (
    <div className="card-form m-20 bg-emerald-100">
      <div className="card-list">{children}</div>
      <div className="card-form__inner bg-emerald-100">
        <div className="card-input">
          <label htmlFor="cardNumber" className="card-input__label">
            Card Number
          </label>
          <Form.Control
            type="text"
            name="cardNumber"
            className="card-input__input"
            autoComplete="off"
            onChange={handleFormChangeNumbers}
            maxLength={16}
            value={selectedCreditCard.cardNumber}
            isInvalid={!!errors.cardNumber}
          />
          <Form.Control.Feedback type="invalid">
            {errors.cardNumber}
          </Form.Control.Feedback>
        </div>

        <div className="card-input">
          <label htmlFor="cardName" className="card-input__label">
            Card Holder Name
          </label>
          <Form.Control
            type="text"
            className="card-input__input"
            autoComplete="off"
            name="cardHolder"
            onChange={handleFormChange}
            value={selectedCreditCard.cardHolder}
            isInvalid={!!errors.cardHolder}
          />
          <Form.Control.Feedback type="invalid">
            {errors.cardHolder}
          </Form.Control.Feedback>
        </div>

        <div className="card-form__row">
          <div className="card-form__col">
            <div className="card-form__group">
              <label htmlFor="cardMonth" className="card-input__label">
                Expiration Date
              </label>
              <Form.Control
                as="select"
                className="card-input__input -select"
                value={selectedCreditCard.cardMonth}
                name="cardMonth"
                onChange={handleFormChange}
                isInvalid={!!errors.cardMonth}
              >
                <option value="" disabled>
                  Month
                </option>

                {monthsArr.map((val, index) => (
                  <option key={index} value={val}>
                    {val}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.cardMonth}
              </Form.Control.Feedback>
              <Form.Control
                as="select"
                name="cardYear"
                className="card-input__input -select"
                value={selectedCreditCard.cardYear}
                onChange={handleFormChange}
                isInvalid={!!errors.cardYear}
              >
                <option value="" disabled>
                  Year
                </option>

                {yearsArr.map((val, index) => (
                  <option key={index} value={val}>
                    {val}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.cardYear}
              </Form.Control.Feedback>
            </div>
          </div>
          <div className="card-form__col -cvv">
            <div className="card-input">
              <label htmlFor="cardCvv" className="card-input__label">
                CVV (Security Code)
              </label>
              <Form.Control
                type="text"
                className="card-input__input"
                minLength={3}
                maxLength={3}
                autoComplete="off"
                name="cardCvv"
                value={selectedCreditCard.cardCvv}
                onChange={handleFormChangeNumbers}
                onFocus={onCvvFocus}
                onBlur={onCvvBlur}
                isInvalid={!!errors.cardCvv}
              />
              <Form.Control.Feedback type="invalid">
                {errors.cardCvv}
              </Form.Control.Feedback>
            </div>
          </div>
        </div>
        <div className="card-form__row">
          <div className="card-form__col">
            {/* <Link href={'/yourcard'}> */}
              <div className="rounded d-grid gap-2 mt-2">
                  <Button variant="primary" className="bg-gradient-to-r from-emerald-600 to-emerald-300 text-white border border-cyan-600 font-semibold mr-8 py-2 px-2 m-2 round z-30 hover:bg-cyan-600 hover:border-transparent hover:opacity-80 hover:tracking-wider transition-colors" size="lg" onClick={handleConfirmAction}>
                    Confirm
                  </Button>{' '}
              </div>
            {/* </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
