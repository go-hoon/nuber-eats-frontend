describe("Edit Profile", () => {
  const user = cy;
  beforeEach(() => {
    //@ts-ignore
    user.login("test@test.com", "12345");
  });

  it("can go to /edit-profile using the header", () => {
    user.get('a[href="/edit-profile"]').click();
    user.wait(1000);
    user.window().title().should("eq", "Edit Profile | Nuber Eats");
  });
  it("can change email", () => {
    user.get('a[href="/edit-profile"]').click();
    user.findByPlaceholderText(/email/i).clear().type("new@test.com");
    user.findByRole("button").click();
  });
});
