import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="container mx-auto p-4 h-screen flex items-center justify-center">
      <div className="flex justify-center flex-wrap gap-4">
        <Input
          type="text"
          onChange={(e) => handelInput(Number(e.target.value))}
          value={amount}
          placeholder="Enter amount"
        />

        <Select value={from} onValueChange={setFrom}>
          <SelectTrigger>
            <SelectValue>{from}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="CAD">CAD</SelectItem>
            <SelectItem value="INR">INR</SelectItem>
          </SelectContent>
        </Select>
        <Select value={to} onValueChange={setTo}>
          <SelectTrigger>
            <SelectValue>{to}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="CAD">CAD</SelectItem>
            <SelectItem value="INR">INR</SelectItem>
          </SelectContent>
        </Select>
        <p>
          {result} {to}
        </p>
      </div>
    </div>
  );
}
