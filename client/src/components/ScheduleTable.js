import React from 'react';

const ScheduleTable = ({ schedule }) => {
  // Функция для определения типа занятия и соответствующего стиля
  const getLessonStyle = (type) => {
    if (!type) return '';
    
    const lowerType = type.toLowerCase();
    if (lowerType.includes('практика')) return 'bg-blue-100 border-blue-300';
    if (lowerType.includes('лекция')) return 'bg-green-100 border-green-300';
    if (lowerType.includes('лабораторная')) return 'bg-purple-100 border-purple-300';
    return 'bg-gray-100 border-gray-300';
  };

  // Функция для создания элемента преподавателя
  const renderTeacher = (teacher) => {
    if (!teacher || teacher === "null") return null;
    
    const teacherData = typeof teacher === 'string' ? JSON.parse(teacher) : teacher;
    
    return (
      <div className="mt-1">
        <span className="text-gray-600">{teacherData.name}</span>
      </div>
    );
  };

  // Группируем занятия по времени и дням недели
  const groupedSchedule = [];
  const daysCount = schedule.dates.length - 1; // Первый элемент - заголовок "Время"
  const timesCount = schedule.times.length;

  for (let timeIndex = 0; timeIndex < timesCount; timeIndex++) {
    const dayLessons = [];
    
    for (let dayIndex = 0; dayIndex < daysCount; dayIndex++) {
      const scheduleIndex = 1 + timeIndex * daysCount + dayIndex + 6;
      if (scheduleIndex < schedule.daysOfSchedule.length) {
        dayLessons.push(schedule.daysOfSchedule[scheduleIndex]);
        console.log(scheduleIndex, schedule.daysOfSchedule[scheduleIndex]);
      } else {
        dayLessons.push(null);
      }
    }
    
    groupedSchedule.push({
      time: schedule.times[timeIndex],
      dayLessons
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse" id="schedule_table">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border text-left">Время</th>
            {schedule.dates.slice(1).map((date, index) => (
              <th key={index} className={`p-2 border text-left column-${index}`}>
                {date}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groupedSchedule.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              <td className="p-2 border font-medium">{row.time}</td>
              
              {row.dayLessons.map((lesson, dayIndex) => (
                <td 
                  key={dayIndex} 
                  className={`p-2 border column-${dayIndex} ${lesson ? getLessonStyle(lesson.type) : ''}`}
                >
                  {lesson?.subject ? (
                    <div className="text-style1">
                      <div className="font-bold">{lesson.subject}</div>
                      <div className="text-gray-600">{lesson.place}</div>
                      {renderTeacher(lesson.teacher)}
                      {lesson.groups && (
                        <div className="mt-1 text-sm text-gray-500">
                          {lesson.groups}
                        </div>
                      )}
                    </div>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;