import React, { useState } from 'react';

const SearchForm = ({ entities, onSearch }) => {
  const [searchType, setSearchType] = useState('group');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.length > 1) {
      const items = searchType === 'group' 
        ? Object.entries(entities.groups)
        : Object.entries(entities.teachers);
      
      setFilteredItems(
        items.filter(([name]) => name.toLowerCase().includes(query))
      );
    } else {
      setFilteredItems([]);
    }
  };

  const handleItemSelect = (id, name) => {
    onSearch(searchType, id);
    setSearchQuery(name); // Показываем выбранное имя вместо очистки
    setFilteredItems([]);
  };

  return (
    <div className="mb-8 relative">
      <div className="flex items-center mb-4">
        <label className="mr-4">
          <input
            type="radio"
            checked={searchType === 'group'}
            onChange={() => setSearchType('group')}
            className="mr-2"
          />
          Группа
        </label>
        <label>
          <input
            type="radio"
            checked={searchType === 'staff'}
            onChange={() => setSearchType('staff')}
            className="mr-2"
          />
          Преподаватель
        </label>
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={`Поиск по ${searchType === 'group' ? 'группам' : 'преподавателям'}`}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {filteredItems.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredItems.map(([name, id]) => (
              <li
                key={id}
                className="p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleItemSelect(id, name)}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchForm;