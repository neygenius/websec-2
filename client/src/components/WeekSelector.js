import React from 'react';

const WeekSelector = ({ currentWeek, selectedWeek, onSelectWeek }) => {
  const weeks = [
    { number: currentWeek - 1, title: `Предыдущая (${currentWeek - 1})` },
    { number: currentWeek, title: `Текущая (${currentWeek})` },
    { number: currentWeek - -1, title: `Следующая (${currentWeek - -1})` }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {weeks.map(week => (
        <button
          key={week.number}
          onClick={() => onSelectWeek(week.number)}
          className={`px-4 py-2 rounded-lg ${
            week.number === selectedWeek
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {week.title}
        </button>
      ))}
    </div>
  );
};

export default WeekSelector;