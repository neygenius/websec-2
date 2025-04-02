import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import WeekSelector from './components/WeekSelector';
import ScheduleTable from './components/ScheduleTable';
import './styles.css';

function App() {
  const [entities, setEntities] = useState({ groups: {}, teachers: {} });
  const [selectedType, setSelectedType] = useState('group');
  const [selectedId, setSelectedId] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageHeader, setPageHeader] = useState('');

  useEffect(() => {
    fetch('/api/entities')
      .then(res => res.json())
      .then(data => setEntities(data))
      .catch(err => console.error('Error loading entities:', err));
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadSchedule();
    }
  }, [selectedId, selectedWeek]);

  const loadSchedule = () => {
    setLoading(true);
    let url = `/api/rasp?${selectedType}Id=${selectedId}`;
    if (selectedWeek) {
      url += `&selectedWeek=${selectedWeek}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setSchedule(data);
        setPageHeader(data.pageHeader);
        // Если неделя не выбрана, устанавливаем текущую
        if (!selectedWeek && data.currentWeek) {
          setSelectedWeek(data.currentWeek);
        }
      })
      .catch(err => console.error('Error loading schedule:', err))
      .finally(() => setLoading(false));
  };

  const handleSearch = (type, id) => {
    setSelectedType(type);
    setSelectedId(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <SearchForm 
          entities={entities} 
          onSearch={handleSearch} 
        />
        
        {pageHeader && (
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{pageHeader}</h2>
        )}

        {selectedWeek && (
          <WeekSelector 
            currentWeek={schedule?.currentWeek}
            selectedWeek={selectedWeek}
            onSelectWeek={setSelectedWeek}
          />
        )}
        
        {loading ? (
          <div className="text-center py-12">Загрузка расписания...</div>
        ) : (
          schedule && <ScheduleTable schedule={schedule} />
        )}
      </div>
    </div>
  );
}

export default App;