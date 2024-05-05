const { Builder, By, Key, until, Select } = require("selenium-webdriver");
const fs = require("fs");

async function runTests() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    // Test Case 1: Open a webpage and verify its title
    await driver.manage().window().maximize();
    await driver.get("https://www.kurtosys.com/");

    // Waiting for the dropdown to appear
    let dropdown = await driver.wait(
      until.elementLocated(By.linkText("INSIGHTS")),
      5000
    );

    // Waiting for the option to appear and clicking it
    let option = await driver.wait(
      until.elementLocated(
        By.xpath("//li[@id='kurtosys-menu-item-75710']//li[3]//a[1]")
      ),
      5000
    );

    let actions = driver.actions({ bridge: true });
    await actions.move({ origin: dropdown }).perform();
    await option.click();
    console.log(
      "Test Case 1 - Open a webpage and navigate to White Papers & eBooks page"
    );

    // Test case 2: Verify title
    let titleElement = await driver.findElement(By.tagName("h2"));
    let title = await titleElement.getText();
    if (title === "White Papers") {
      console.log("Test Case 2 - Title verification passed.");
    } else {
      console.error(
        'Test Case 2 - Title verification failed. Expected: "White Papers", Actual:',
        title
      );
    }

    // Test case 3: Click on Institutional reporting survey
    await driver
      .findElement(
        By.xpath("//a[normalize-space()='Institutional reporting survey']")
      )
      .click();
    console.log("Test Case 3 - Institutional reporting survey clicked.");

    //Test case 4: Fill in form
    await driver.findElement(By.id("form-field-firstname")).sendKeys("Athi");
    await driver.findElement(By.id("form-field-lastname")).sendKeys("Fukama");
    await driver.findElement(By.id("form-field-company")).sendKeys("AF");

    let dropdownField = await driver.findElement(By.id("form-field-industry")); // Replace "dropdownId" with the actual id of the dropdown field
    await driver.wait(until.elementIsVisible(dropdownField), 5000);
    let selectInstance = new Select(dropdownField);
    await selectInstance.selectByVisibleText("Banking"); // Replace "Option Text" with the text of the option you want to select
    console.log("Test Case 4 - Form filled in");

    //Test case 5: Click send me a copy
    let closeBtn = await driver.findElement(
      By.xpath(`//*[@id="onetrust-close-btn-container"]/button`)
    );
    if (closeBtn.isDisplayed) {
      closeBtn.click();
    }

    await driver
      .findElement(By.xpath("//span[contains(text(),'Proceed to download')]"))
      .click();
    await driver.sleep(2000); // Adjust the wait time as needed
    // Check if the error message appears
    let errorMessages = await driver.findElements(By.css("input:invalid"));
    if (errorMessages.length > 0) {
      console.log(
        "Test Case 5 - Error message for required field is displayed."
      );
    } else {
      console.error(
        "Test Case 5 - Error message for required field is not displayed."
      );
    }

    // Take a screenshot
    await takeScreenshot(driver, "screenshot.png");
    console.log("Test Case 5 - Take screenshot.");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await driver.quit();
  }
}

async function takeScreenshot(driver, filename) {
  try {
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(filename, screenshot, "base64");
    console.log("Screenshot saved:", filename);
  } catch (error) {
    console.error("Failed to capture screenshot:", error);
  }
}

runTests();
