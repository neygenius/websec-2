import React from 'react';

const ScheduleItem = ({ item, time }) => {
  // Определяем цвет по типу занятия
  const getColorClass = (subject) => {
    if (!subject) return 'gray';
    if (subject.toLowerCase().includes('лек')) return 'blue';
    if (subject.toLowerCase().includes('лаб')) return 'green';
    if (subject.toLowerCase().includes('пр')) return 'purple';
    return 'gray';
  };

  const colorClass = getColorClass(item.subject);

  return (
    <div className={`p-4 border-l-4 ${
      colorClass === 'blue' ? 'border-blue-500 bg-blue-50' :
      colorClass === 'green' ? 'border-green-500 bg-green-50' :
      colorClass === 'purple' ? 'border-purple-500 bg-purple-50' :
      'border-gray-500 bg-gray-50'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-2 md:mb-0">
          <span className="font-semibold text-gray-700">{time}</span>
          <h4 className="text-lg font-bold">{item.subject}</h4>
          {item.teacher && (
            <p className="text-gray-600">
              {item.teacher.name}
            </p>
          )}
        </div>
        
        <div className="text-right">
          {item.place && <p className="text-gray-700">{item.place}</p>}
          {item.groups && (
            <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-800">
              {item.groups}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleItem;