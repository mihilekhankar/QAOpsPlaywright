Feature: Ecommerce Validations
@Regression
  Scenario: Placing the order
    Given a login to Ecommerce application with "mihil@gmail.com" and "Admin@123"
    When Add "ZARA COAT 3" to the cart
    Then Verify "ZARA COAT 3" is displayed in the cart
    When Enter valid details and place the order
    Then Verify the order is present in the OrderHistory