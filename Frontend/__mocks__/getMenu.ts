const mockMenu = [{
    _id : "menuTest1",
    name : "test1",
    price : 150,
    restaurant : "restaurant2"
}, {
    _id: "menuTest2",
    name: "test2",
    price: 100,
    restaurant : "restaurant2"
}]

const getMenu = jest.fn().mockResolvedValue({
    data: mockMenu,
});
  
export default getMenu;