export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
}

export function getTokenPayload(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    return null;
  }
}

export function removeToken(): void {
  localStorage.removeItem("authToken");
}

export function getStoredToken(): string | null {
  return localStorage.getItem("authToken");
}

export function setStoredToken(token: string): void {
  localStorage.setItem("authToken", token);
}