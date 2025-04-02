import requests
from bs4 import BeautifulSoup
import json
import re
from time import sleep
from tqdm import tqdm


def safe_get(url, max_retries=3):
    for _ in range(max_retries):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.text
        except (requests.RequestException, ConnectionError):
            sleep(2)
    raise Exception(f"Не удалось загрузить страницу: {url}")

def parse_teachers():
    print("Начинаю парсинг преподавателей...")
    teachers = {}
    base_url = "https://ssau.ru/staff"
    
    # Сначала получаем общее количество страниц
    html = safe_get(base_url)
    soup = BeautifulSoup(html, 'html.parser')
    last_page = 1
    
    pagination = soup.find('ul', class_='pagination')
    if pagination:
        last_page_links = pagination.find_all('li')[-2].find_all('a')
        if last_page_links:
            last_page = int(last_page_links[0].text.strip())
    
    # Парсим каждую страницу
    for page in tqdm(range(1, last_page + 1), desc="Преподаватели"):
        url = f"{base_url}?page={page}&letter=0"
        html = safe_get(url)
        soup = BeautifulSoup(html, 'html.parser')
        
        # Ищем всех преподавателей в списке
        teacher_items = soup.find_all('li', class_=['list-group-item', 'list-group-item-action'])
        
        for item in teacher_items:
            link = item.find('a', href=True)
            if link:
                href = link['href']
                # Извлекаем staffId до первого "-" в ссылке
                staff_id = href.split('/')[-1].split('-')[0]
                if staff_id.isdigit():  # Проверяем, что это числовой ID
                    name = ' '.join(link.text.strip().split())
                    teachers[name] = staff_id
    
    return teachers

def parse_groups():
    print("Начинаю парсинг групп...")
    groups = {}
    base_url = "https://ssau.ru/rasp"
    
    # Получаем список факультетов
    html = safe_get(base_url)
    soup = BeautifulSoup(html, 'html.parser')
    
    faculty_links = soup.select('a[href^="/rasp/faculty/"]')
    faculty_ids = set()
    
    for link in faculty_links:
        href = link['href']
        match = re.search(r'/rasp/faculty/(\d+)', href)
        if match:
            faculty_ids.add(match.group(1))
    
    # Для каждого факультета получаем группы
    for faculty_id in tqdm(faculty_ids, desc="Факультеты"):
        for course in range(1, 7):  # Обычно до 6 курса
            url = f"{base_url}/faculty/{faculty_id}?course={course}"
            try:
                html = safe_get(url)
                soup = BeautifulSoup(html, 'html.parser')
                
                for group_link in soup.select('a[href*="groupId="]'):
                    href = group_link['href']
                    group_name = group_link.text.strip()
                    group_id = re.search(r'groupId=(\d+)', href).group(1)
                    groups[group_name] = group_id
            except Exception as e:
                print(f"Ошибка при обработке {url}: {str(e)}")
                continue
    
    return groups

def main():
    try:
        # Парсинг данных
        teachers = parse_teachers()
        groups = parse_groups()
        
        # Сохранение в JSON
        with open('entities.json', 'w', encoding='utf-8') as f:
            json.dump({
                "groups": groups,
                "teachers": teachers
            }, f, ensure_ascii=False, indent=2)

        print("Парсинг успешно завершен!")
        print(f"Найдено преподавателей: {len(teachers)}")
        print(f"Найдено групп: {len(groups)}")
    
    except Exception as e:
        print(f"Ошибка при выполнении парсинга: {str(e)}")


if __name__ == "__main__":
    main()
