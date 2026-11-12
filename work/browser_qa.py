from pathlib import Path
from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
OUTPUTS = ROOT / "outputs"
OUTPUTS.mkdir(exist_ok=True)


def wait_for_app(page):
    page.goto("http://127.0.0.1:4173", wait_until="domcontentloaded")
    try:
        page.wait_for_load_state("networkidle", timeout=5_000)
    except Exception:
        # Streaming video may keep the network busy after the React UI is ready.
        page.wait_for_selector("text=Estimated", timeout=15_000)
    page.wait_for_timeout(2_200)


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel="chrome")
    console_errors = []
    failed_requests = []

    desktop = browser.new_page(viewport={"width": 1440, "height": 900})
    desktop.on(
        "console",
        lambda message: console_errors.append(message.text)
        if message.type == "error"
        else None,
    )
    desktop.on(
        "requestfailed",
        lambda request: failed_requests.append(
            f"{request.url} :: {request.failure}"
        ),
    )
    wait_for_app(desktop)

    number = int(desktop.locator("[aria-live='polite']").inner_text())
    assert number >= 28, f"Expected completed count-up, got {number}"
    assert desktop.locator("text=Benjamin Carter").is_visible()
    assert desktop.locator("text=3 Years Younger").is_visible()
    assert desktop.locator("video").get_attribute("autoplay") is not None
    assert desktop.locator("video").get_attribute("loop") is not None
    assert desktop.locator("video").evaluate("(video) => video.muted") is True

    desktop.screenshot(path=str(OUTPUTS / "biological-age-dashboard-desktop.png"))

    snapshot = desktop.locator("button").filter(has_text="Your Health Snapshot")
    snapshot.hover()
    desktop.wait_for_timeout(400)
    assert snapshot.get_attribute("aria-expanded") == "true"
    assert desktop.locator("text=With a biological age of 28").is_visible()

    mobile = browser.new_page(viewport={"width": 390, "height": 844})
    mobile.on(
        "console",
        lambda message: console_errors.append(message.text)
        if message.type == "error"
        else None,
    )
    wait_for_app(mobile)
    assert mobile.locator("text=Benjamin Carter").is_hidden()
    for scroll_position in (650, 950, 1250, 1600):
        mobile.evaluate(f"window.scrollTo(0, {scroll_position})")
        mobile.wait_for_timeout(500)
    mobile_snapshot = mobile.locator("button").filter(has_text="Your Health Snapshot")
    mobile_snapshot.click()
    mobile.wait_for_timeout(1_300)
    assert mobile_snapshot.get_attribute("aria-expanded") == "true"
    mobile.screenshot(
        path=str(OUTPUTS / "biological-age-dashboard-mobile.png"),
        full_page=True,
    )

    print(
        {
            "desktop_age": number,
            "desktop_scroll_width": desktop.evaluate(
                "document.documentElement.scrollWidth"
            ),
            "desktop_viewport_width": 1440,
            "mobile_scroll_width": mobile.evaluate(
                "document.documentElement.scrollWidth"
            ),
            "mobile_viewport_width": 390,
            "console_errors": console_errors,
            "failed_requests": failed_requests,
        }
    )
    browser.close()
