Feature: Ecommerce Validations
@Validation
@foo
  Scenario: Placing the order
    Given a login to Ecommerce2 application with "<username>" and "<password>"
    Then Verify Error message is displayed

    Examples:
      | username              | password   |
      | hello@123.com         | hello@123  |
      | mihil@gmail.com       | Admin@123  |
      