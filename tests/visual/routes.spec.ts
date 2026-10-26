import { test, expect } from "@playwright/test";
for(const path of ["/","/reservar"]) test("visual smoke " + path,async({page},info)=>{await page.goto(path);await expect(page.locator("body")).toBeVisible();await expect(page.locator("body")).not.toContainText("Application error");await page.screenshot({path:info.outputPath("screen.png"),fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);});
test("admin guard redirects anonymous users",async({page})=>{await page.goto("/admin");await expect(page).toHaveURL(/login/);});
