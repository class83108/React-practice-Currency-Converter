import { useEffect, useState } from "react";

/**
 * App component that provides a currency converter.
 *
 * @component
 * @example
 * return (
 *   <App />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @description
 * This component allows users to convert an amount from one currency to another using the Frankfurter API.
 * https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD
 * It maintains state for the amount, the source currency, the target currency, and the conversion result.
 * The conversion is triggered whenever the amount, source currency, or target currency changes.
 *
 * @function
 * @name App
 */
export default function App() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("USD");
  const [result, setResult] = useState("OUTPUT");

  useEffect(() => {
    const controller = new AbortController();
    async function convert() {
      const resp = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`,
        { signal: controller.signal }
      );
      const data = await resp.json();
      setResult(data.rates[to]);
    }
    // 不要讓from跟to一樣 不然API會壞掉
    if (from === to) return setResult(amount);
    convert();

    return function () {
      // 避免競爭問題
      controller.abort();
    };
  }, [amount, from, to]);

  function handelInput(value) {
    setAmount(value);
  }

  return (
    <div>
      <input
        type="text"
        onChange={(e) => handelInput(Number(e.target.value))}
        value={amount}
      />
      <select value={from} onChange={(e) => setFrom(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select value={to} onChange={(e) => setTo(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>
        {result} {to}
      </p>
    </div>
  );
}
