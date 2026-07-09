
export const STANBIC_LOGO = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIADgAOAMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAABgIFAwQHAf/EADkQAAECBQEEBwUGBwAAAAAAAAECAwAEBQYREgcTITEyQWFxgZHBFEJRkqEVFiIjUrEkQ2NyouHi/8QAGQEAAwEBAQAAAAAAAAAAAAAAAgMEAQUA/8QAJxEAAgEDAgUEAwAAAAAAAAAAAQIAAxESIVETMUFhcQQigaEyM7H/2gAMAwEAAhEDEQA/AO3POoZaW66oIbQkqUo8gBzMJ4vCpVJa/u/QnJhpKtIfdVgE93IecW18Pbi06mvP8nT5kD1hToc5UaXsqkZ2mqT7WXS4d4nUFJLysg94h9NRje1yTaKqNbroJbb2/ZjiJemSvYTn1VEfY9oGc/aVM/t0/wDEQZr0pX6PL1GZrb1CUFKbdZS8gBShzxkZ8YEUp6pNF6g3jNTBHUp8K+o5eUGG3AHxALbXPzJl3aDLcdxSpvsBwT9UxBV6VWlKQbkt56VlioJVMsr1pTns/wB574000/aDLvaZepbxH9fdKT+2qLW5magrZ5Um6y9LPTyGCt1UskpRlJCgADx5AQXtyCsAb7TQxIJFx5ja04h1tLjagpCwFJUDwIPIx5FJYbu+s2jq+EqhHyjHpBErLixEcpuAZpbUHN3ZM/j3i2P80n0jBa85KSFj2yxPISpmebbl/wAXLUpClDPeRjxie1cE2TOEDktsn5gPWF2qsGf2SUBTJIU02ysEHkoII/eHouSKO8TUbG57TVrFJbpNRflt0nSDlCiOkk8ooJpDbbwfl1Ll308nWVlCh4iG+oTv3lsdqttp1T0ikomkJ58Ol6K7iYnbNvW9X7ZZqa35hClAh5RdA3SxwI5Yx39WIuHqE4YzHac9fStxTidOYic5clf3ZaNcnSjGMawD8wGfrDPZq1TGzC4ELUpa8zeVKUSSd3niTGR7Zmne7xFZSJXnlTOVY79WPGLCWZo1Ksmss0SYMxLoamN68V6tbujB48vgOHCEVqlIgcPeXorC+UstlbhcsSmknJSXU+Tq8fSPIhslQpNhyBUMalvEd29VBEdb9jeTG0/xEvbmpv2xQJ6njGp9khGf1c0/UCOfbMppFYtWoWrNK3c5JKUW0r5hJVkHwXkHwjqkcq2h25UqHWU36lXid442vkl33fPJHbkRu27i0b6n7WnRqpVWGqXCSQcDxGUntBjKX7e2p09Baf+zLhZTn05/GkjrHLWnPWOI7IybSKLP1G05aoPaBWqWA4p1g5CgOkpPkFgdXGGMwZrHS/9gKuK6a2iJctFfpFcdo0ul10KWBLN6id4lXR4cuzwMNlyp+7tlSNsSeHZ+cIa0o99SlZWR3qOkd8bCL1oj1Ekbinm2lVZLKmg2nphY6YHwTnjqPUe3EWFg27P1Gqm7bkQUvqH8FLKGN2n9WDy4E4HaSeJg2qlgCwsB9mYEsSB1+hHi36amj0SRpyTq9mYS2VfqIHE+JyYIsIIiJubygaQgggjJ6c8u3ZVTKu+Z6jumlz2rX+WPyyr44HFJ7R5RQNUHaeAaU5PJXL4x7Wt1sjTyxrxvD5ZgghorN118wMB0jLaGzGl0NaJqoKTPzqSCnUjDTZ+IT1ntPgBD7BBAM7ObtCChdBCCCCBmz/2Q==";

export interface Transaction {
  id: string;
  name: string;
  type: 'debit' | 'credit';
  amount: number;
  date: string;
  bank?: string;
}

export interface ActiveInvestment {
  id: string;
  amount: number;
  maturityDate: string;
  interestRate: number;
  startDate: string;
  name: string;
  durationMonths: number;
}

export interface UserProfile {
  name: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  investmentBalance: number;
  activeInvestments: ActiveInvestment[];
}

export enum AppScreen {
  DASHBOARD = 'DASHBOARD',
  PROFILE = 'PROFILE',
  TRANSFER = 'TRANSFER',
  ACTIVITY = 'ACTIVITY',
  INVESTMENT = 'INVESTMENT'
}
