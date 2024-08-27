import React, { useState, useEffect } from "react";

interface Trip {
  name: string;
  expenses: { category: string; amount: number; description: string }[];
}

interface Expense {
  category: string;
  amount: number;
  description: string;
}

const App = () => {
  const [trips, setTrips] = useState<Trip[]>(
    JSON.parse(localStorage.getItem("trips") || "[]")
  );
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [newTripName, setNewTripName] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState("Transport");
  const [newExpenseAmount, setNewExpenseAmount] = useState(0);
  const [newExpenseDescription, setNewExpenseDescription] = useState("");
  const [expenseToRemove, setExpenseToRemove] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (trips.length > 0) {
      setCurrentTrip(trips[trips.length - 1]);
    }
  }, [trips]);

  const handleAddTrip = () => {
    if (newTripName.trim() !== "") {
      const newTrip: Trip = { name: newTripName, expenses: [] };
      setTrips([...trips, newTrip]);
      setCurrentTrip(newTrip);
      setNewTripName("");
      localStorage.setItem("trips", JSON.stringify([...trips, newTrip]));
    }
  };

  const handleAddExpense = () => {
    if (
      currentTrip &&
      newExpenseCategory &&
      newExpenseAmount > 0 &&
      newExpenseDescription.trim() !== ""
    ) {
      const newExpense: Expense = {
        category: newExpenseCategory,
        amount: newExpenseAmount,
        description: newExpenseDescription,
      };
      currentTrip.expenses.push(newExpense);
      setTrips([...trips]);
      setNewExpenseCategory("Transport");
      setNewExpenseAmount(0);
      setNewExpenseDescription("");
      localStorage.setItem("trips", JSON.stringify(trips));
    }
  };

  const handleRemoveExpense = () => {
    if (currentTrip && expenseToRemove) {
      const updatedExpenses = currentTrip.expenses.filter(
        (expense) => expense.category !== expenseToRemove
      );
      currentTrip.expenses = updatedExpenses;
      setTrips([...trips]);
      setExpenseToRemove("");
      localStorage.setItem("trips", JSON.stringify(trips));
    }
  };

  const handleExportToExcel = () => {
    if (currentTrip) {
      const csvContent = `Category,Amount,Description\n${currentTrip.expenses
        .map(
          (expense) =>
            `${expense.category},${expense.amount},${expense.description}`
        )
        .join("\n")}`;
      const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${currentTrip.name}.csv`);
      link.click();
    }
  };

  const handleReset = () => {
    setConfirmReset(true);
  };

  const handleConfirmReset = () => {
    setTrips([]);
    setCurrentTrip(null);
    setNewTripName("");
    setNewExpenseCategory("Transport");
    setNewExpenseAmount(0);
    setNewExpenseDescription("");
    setExpenseToRemove("");
    localStorage.setItem("trips", "[]");
    setConfirmReset(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md relative">
      <button
        onClick={handleReset}
        className="absolute top-4 right-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Reset
      </button>
      {confirmReset && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">Confirm Reset</h2>
            <p className="mb-4">Are you sure you want to reset all data?</p>
            <button
              onClick={handleConfirmReset}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center mb-4">
        <img
          src="https://w7.pngwing.com/pngs/417/38/png-transparent-expense-management-finance-budget-android-thumbnail.png"
          width="70"
          height="60"
          alt="Expense Tracker"
          className="mr-4"
        />
        <h1 className="text-4xl font-bold text-indigo-600">Trip Planner</h1>
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-lg font-bold text-gray-600 mb-2">
          New Trip:
        </label>
        <input
          type="text"
          value={newTripName}
          onChange={(e) => setNewTripName(e.target.value)}
          className="p-2 border border-gray-400 rounded mb-2"
        />
        <button
          onClick={handleAddTrip}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Trip
        </button>
      </div>
      {trips.length > 0 && (
        <div className="flex flex-col mb-4">
          <label className="text-lg font-bold text-gray-600 mb-2">
            Select Trip:
          </label>
          <select
            value={currentTrip?.name || ""}
            onChange={(e) =>
              setCurrentTrip(
                trips.find((trip) => trip.name === e.target.value) || null
              )
            }
            className="p-2 border border-gray-400 rounded mb-2"
          >
            {trips.map((trip) => (
              <option key={trip.name} value={trip.name}>
                {trip.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {currentTrip && (
        <div className="flex flex-col mb-4">
          <label className="text-lg font-bold text-gray-600 mb-2">
            New Expense:
          </label>
          <select
            value={newExpenseCategory}
            onChange={(e) => setNewExpenseCategory(e.target.value)}
            className="p-2 border border-gray-400 rounded mb-2"
          >
            <option value="Transport">Transport</option>
            <option value="Food">Food</option>
            <option value="Hotel">Hotel</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="number"
            value={newExpenseAmount}
            onChange={(e) => setNewExpenseAmount(Number(e.target.value))}
            className="p-2 border border-gray-400 rounded mb-2"
          />
          <input
            type="text"
            value={newExpenseDescription}
            onChange={(e) => setNewExpenseDescription(e.target.value)}
            className="p-2 border border-gray-400 rounded mb-2"
          />
          <button
            onClick={handleAddExpense}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Expense
          </button>
        </div>
      )}
      {currentTrip && (
        <div className="flex flex-col mb-4">
          <label className="text-lg font-bold text-gray-600 mb-2">
            Expenses:
          </label>
          <ul>
            {currentTrip.expenses.map((expense) => (
              <li key={expense.category}>
                {expense.category} - ₹{expense.amount} - {expense.description}
                <button
                  onClick={() => setExpenseToRemove(expense.category)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-4 text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {expenseToRemove && (
            <button
              onClick={handleRemoveExpense}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Confirm Remove
            </button>
          )}
        </div>
      )}
      {currentTrip && (
        <button
          onClick={handleExportToExcel}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Export to Excel
        </button>
      )}
    </div>
  );
};

export default App;
