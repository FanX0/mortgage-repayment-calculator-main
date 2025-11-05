import { useState } from "react";
import { useForm } from "react-hook-form";
import CalculatorLayout from "@/coomponent/layout/CalculatorLayout";
import calculateIcon from "@/assets/images/icon-calculator.svg";
import noResults from "@/assets/images/illustration-empty.svg";

type FormValues = {
  amount: number;
  term: number;
  interest: number;
  type: "repayment" | "interest-only";
};

const Calculator = () => {
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [lastFormValues, setLastFormValues] = useState<FormValues | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const calculateRepayments = (data: FormValues) => {
    const { amount, term, interest, type } = data;
    const monthlyInterestRate = interest / 12 / 100;
    const numberOfPayments = term * 12;
    if (type === "repayment") {
      if (monthlyInterestRate === 0) {
        return amount / numberOfPayments;
      }
      const repayment =
        (amount * monthlyInterestRate) /
        (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
      return repayment;
    } else {
      const interestOnlyMonthly = amount * monthlyInterestRate;
      return interestOnlyMonthly;
    }
  };

  const onSubmit = (data: FormValues) => {
    const payment = calculateRepayments(data);
    setMonthlyPayment(payment);
    const numberOfPayments = data.term * 12;
    const total = payment * numberOfPayments;
    setTotalPayment(total);
    setLastFormValues(data);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:mx-[12rem] lg:my-[12rem] ">
      <CalculatorLayout>
        <div className="flex flex-col gap-[1rem] items-start ">
          <div className="w-full flex flex-col gap-[0.5rem] items-start lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-3xl font-semibold ">Mortgage Calculator</h1>
            <button
              type="button"
              onClick={() => {
                reset();
                setMonthlyPayment(null);
                setTotalPayment(null);
                setLastFormValues(null);
              }}
              className=""
            >
              ClearAll
            </button>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-[1rem]"
          >
            <fieldset className="flex flex-col gap-[1rem] w-full">
              <p className="flex flex-col gap-[0.5rem] w-full">
                <div className="flex flex-row justify-between items-center">
                  <label htmlFor="amount">Mortgage Amount</label>
                  {errors.amount?.message ? (
                    <p className="text-Red text-sm">{errors.amount.message}</p>
                  ) : null}
                </div>
                <div className="relative ">
                  <input
                    type="number"
                    id="amount"
                    className="w-full !pl-[2rem] pr-[1rem]"
                    {...register("amount", {
                      valueAsNumber: true,
                      required: "Mortgage amount is required",
                      min: {
                        value: 0,
                        message: "Mortgage amount must be greater than 0",
                      },
                    })}
                  />
                  <p className="absolute left-3 top-1/2 -translate-y-1/2 font-normal text-xl select-none pointer-events-none">
                    £
                  </p>
                </div>
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1rem]">
                <p className="flex flex-col gap-[0.5rem] items-start w-full">
                  <div className="flex flex-row justify-between items-center w-full">
                    <label htmlFor="term">Mortgage Term</label>
                    {errors.term?.message ? (
                      <p className="text-Red text-sm">{errors.term.message}</p>
                    ) : null}
                  </div>
                  <div className="relative w-full">
                    <input
                      type="number"
                      id="term"
                      className="w-full  !pr-[5rem]"
                      {...register("term", {
                        valueAsNumber: true,
                        required: "Mortgage term is required",
                        min: {
                          value: 0,
                          message: "Mortgage term must be greater than 0",
                        },
                      })}
                    />
                    <p className="absolute right-3 top-1/2 -translate-y-1/2 font-normal text-xl select-none pointer-events-none">
                      years
                    </p>
                  </div>
                </p>
                <p className="flex flex-col gap-[0.5rem] items-start w-full">
                  <div className="flex flex-row justify-between items-center w-full">
                    <label htmlFor="interest">Interest Rate</label>
                    {errors.interest?.message ? (
                      <p className="text-Red text-sm">
                        {errors.interest.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="relative w-full">
                    <input
                      type="number"
                      id="interest"
                      className="w-full  !pr-[3rem]"
                      {...register("interest", {
                        valueAsNumber: true,
                        required: "Interest rate is required",
                        min: {
                          value: 0,
                          message: "Interest rate must be greater than 0",
                        },
                      })}
                    />
                    <p className="absolute right-3 top-1/2 -translate-y-1/2 font-normal text-xl select-none pointer-events-none">
                      %
                    </p>
                  </div>
                </p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <p>Mortgage Type</p>
                {errors.type?.message ? (
                  <p className="text-Red text-sm">{errors.type.message}</p>
                ) : null}
              </div>
              <div
                role="radiogroup"
                className="flex flex-col gap-[0.5rem] items-start"
              >
                <label className="radio-container flex items-center gap-3">
                  <input
                    type="radio"
                    id="repayment"
                    value="repayment"
                    aria-invalid={errors.type ? "true" : "false"}
                    className=""
                    {...register("type", {
                      required: "Mortgage type is required",
                    })}
                  />
                  <span>Repayment</span>
                </label>
                <label className="radio-container flex items-center gap-3 ">
                  <input
                    type="radio"
                    id="interest-only"
                    value="interest-only"
                    aria-invalid={errors.type ? "true" : "false"}
                    {...register("type", {
                      required: "Mortgage type is required",
                    })}
                  />
                  <span>Interest Only</span>
                </label>
              </div>
            </fieldset>
            <button
              type="submit"
              className="bg-amber-300 px-[1.5rem] py-[0.5rem] rounded-full font-semibold flex items-center gap-3 justify-center"
            >
              <img src={calculateIcon} alt="" />
              Calculate Repayments
            </button>
          </form>
        </div>
      </CalculatorLayout>
      {monthlyPayment ? (
        <div className="bg-cyan-900 py-[1.5rem] lg:rounded-r-[2rem] lg:rounded-bl-[2rem] flex flex-col justify-center">
          {monthlyPayment !== null && lastFormValues !== null ? (
            <div className="px-[1.5rem]  flex flex-col gap-[1rem]">
              <div className="flex flex-col gap-[0.5rem]">
                <h2 className="text-white text-2xl font-semibold">
                  Your Results
                </h2>
                <p className="text-white text-[1.2rem] font-normal">
                  Your results are shown below based on the information you
                  provided. To adjust the results, edit thhe form and click
                  "calculate repayments" again.
                </p>
              </div>
              <div className="bg-Lime rounded-lg pt-[0.2rem]">
                <div className="bg-Slate-900 rounded-t-lg p-[1rem]  ">
                  <p className="text-[1.1rem] text-Slate-100 font-normal">
                    {lastFormValues.type === "repayment"
                      ? "Your monthly repayment"
                      : "Your monthly interest-only payment"}
                  </p>
                  <p className="text-[2rem] text-Lime font-semibold border-b-1 border-Slate-300">
                    £{monthlyPayment.toFixed(2)}
                  </p>
                </div>
                <div className="bg-Slate-900 rounded-b-lg pb-[1rem] px-[1rem] ">
                  <p className="text-[1.1rem] text-Slate-100 font-normal">
                    {lastFormValues.type === "repayment"
                      ? "Total you'll repay over the term"
                      : "Total interest paid over the term"}
                  </p>
                  {totalPayment !== null ? (
                    <p className="text-[1.5rem] text-white font-semibold">
                      £{totalPayment.toFixed(2)}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="bg-cyan-900 py-[4rem] px-[1.5rem] flex flex-col items-center justify-center text-center lg:rounded-r-[2rem] lg:rounded-bl-[2rem]">
          <img src={noResults} alt="" />
          <p className="text-white text-[1.2rem] font-semibold">
            Result shown here
          </p>
          <p className="text-white text-[1.2rem] font-normal text-center">
            Complete the form and click "calculate repayments" to see the
            results.
          </p>
        </div>
      )}
    </div>
  );
};

export default Calculator;
