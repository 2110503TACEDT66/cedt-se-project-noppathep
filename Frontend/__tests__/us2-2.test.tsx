import '@testing-library/jest-dom';
import userLogIn from '@/libs/user/userLogIn';
import getReservation from '@/libs/reservation/getReservation';
import orderFood from '@/libs/orderFood';

describe('Test US2-2', () => {
    let loginResult:any;
     
    beforeEach(async() => {
        const validCredentials = {
            email: 'foodOrderTest@gmail.com',
            password: '12345678',
        };
        
        loginResult = await userLogIn(validCredentials.email, validCredentials.password); 
    })


   it('Order food Test', async() => {
    const reservation = await getReservation("6631014effe5b42c0c31bac3", loginResult.token);
    const orderCount = reservation.data.foodOrder.length;
    const foodOrder = reservation.data.foodOrder;
    let orders: any[] = [];
    foodOrder.forEach((menuItem: { _id : string}) => {
      orders.push(menuItem._id);
    });
    orders.push("663101bbffe5b42c0c31bae8");
    const response = await orderFood("6631014effe5b42c0c31bac3",loginResult.token, "663101bbffe5b42c0c31bae8");
    expect(response.data.foodOrder.length).toBe(orderCount+1);
    expect(response.data.foodOrder).toStrictEqual(orders);
   })

   it('Food id isnt in restaurant Throws error when cannot order food', async () => {

    jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
        return Promise.resolve({
            status: 500,
            json: () => Promise.resolve({ error: "Cannot Order food" }) 
        });
    });


    await expect(async () => {
        await orderFood("6631014effe5b42c0c31bac3", loginResult.token, "wrongIDXD");
    }).rejects.toThrowError("Cannot Order food");
    });

    it('token dont work Throws error when cannot order food', async () => {
    
      jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
          return Promise.resolve({
              status: 500, 
              json: () => Promise.resolve({ error: "Cannot Order food" }) 
          });
      });
  

      await expect(async () => {
          await orderFood("6631014effe5b42c0c31bac3", "faketoken", "663101bbffe5b42c0c31bae8");
      }).rejects.toThrowError("Cannot Order food");
      });

      it('reservation is not real Throws error when cannot order food', async () => {
        jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
            return Promise.resolve({
                status: 500,
                json: () => Promise.resolve({ error: "Cannot Order food" })
            });
        });
    
        await expect(async () => {
            await orderFood("fakeMenu", loginResult.token, "663101bbffe5b42c0c31bae8");
        }).rejects.toThrowError("Cannot Order food");
        });  

   it('Total payment Test', async () => {
    const response = await getReservation("6631014effe5b42c0c31bac3", loginResult.token);

    if (response && response.data.foodOrder) {
        let totalPrice = 0;
        const foodOrder = response.data.foodOrder;
        foodOrder.forEach((menuItem: { price: number; }) => {
            totalPrice += menuItem.price;
        });
        expect(response.totalPrice).toBe(totalPrice);
    } else {
        fail("Response or foodOrder is undefined");
    }
  })
  
})