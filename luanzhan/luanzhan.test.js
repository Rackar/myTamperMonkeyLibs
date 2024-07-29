import { addUI } from "./%E4%B9%B1%E5%8D%A0.user";

describe("addUI function", () => {
  beforeEach(() => {
    // 在每个测试用例执行前清理 DOM
    document.body.innerHTML = "";
  });

  it("should add stylesheet to head", () => {
    addUI();

    const styleElement = document.getElementsByTagName("style")[0];
    expect(styleElement).toBeDefined();
  });

  it("should create container div and append it to body", () => {
    addUI();

    const containerDiv = document.querySelector("div");
    expect(containerDiv).toBeDefined();
  });

  it("should create close button and append it to containerDiv", () => {
    addUI();

    const closeButton = document.querySelector(
      'button[title="关闭后需刷新页面重新打开"]'
    );
    expect(closeButton).toBeDefined();
  });

  it("should make containerDiv draggable", () => {
    addUI();

    const containerDiv = document.querySelector("div");
    expect(containerDiv.style.cursor).toEqual("move");
  });

  it("should create pass options and append them to passContainer", () => {
    addUI();

    const passOptions = document.querySelectorAll("#myPassPanel > div > input");
    expect(passOptions.length).toEqual(7);
  });

  it("should create single pass button and append it to containerDiv", () => {
    addUI();

    const singleButton = document.querySelector("#singleButton");
    expect(singleButton).toBeDefined();
  });

  it("should create checkboxes and append them to refuseContainer", () => {
    addUI();

    const checkboxes = document.querySelectorAll("#myCheckbox > div > input");
    expect(checkboxes.length).toEqual(13);
  });

  it("should create single refuse button and append it to containerDiv", () => {
    addUI();

    const singleRefuseButton = document.querySelector("#singleRefuseButton");
    expect(singleRefuseButton).toBeDefined();
  });

  it("should create clear button and append it to containerDiv", () => {
    addUI();

    const singleClearButton = document.querySelector("#singleClearButton");
    expect(singleClearButton).toBeDefined();
  });
});
