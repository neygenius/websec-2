const express = require('express');
const axios = require('axios');
const { parse } = require('node-html-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Загружаем данные из entities.json (сгенерированные парсером)
const entities = require('./entities.json');

// API для получения списка групп и преподавателей
app.get('/api/entities', (req, res) => {
    res.json(entities);
});

// Ваша функция парсинга расписания с минимальными изменениями
app.get('/api/rasp', async (req, res) => {
    try {
        const url = "https://ssau.ru" + req.url.replace('/api', '');
        const response = await axios.get(url);
        const root = parse(response.data);
        
        let schedule = {
            dates: [],
            daysOfSchedule: [],
            times: [],
            groupInfo: {},
            pageHeader: ""
        };

        // Парсим заголовок страницы
        const pageHeader = root.querySelector(".page-header h1.h1-text");
        if (pageHeader) {
            schedule.pageHeader = pageHeader.innerText.trim();
        }

        // Парсим даты
        for (let cell of root.querySelectorAll(".schedule__head")) {
            if (cell.innerText.trim()) {
                schedule.dates.push(cell.innerText.trim());
            }
        }

        // Парсим занятия
        for (let cell of root.querySelectorAll(".schedule__item")) {
            const lessonInfo = cell.querySelector('.schedule__lesson-info');

            if (lessonInfo) {
                const subject = lessonInfo.querySelector('.schedule__discipline')?.innerText.trim();
                const place = lessonInfo.querySelector('.schedule__place')?.innerText.trim();
                const type = cell.querySelector('.schedule__lesson-type-chip')?.innerText.trim();
                
                let teacher = null;
                const teacherElement = lessonInfo.querySelector('.schedule__teacher a');
                if (teacherElement) {
                    teacher = {
                        name: teacherElement.innerText.trim(),
                        link: teacherElement.getAttribute('href')
                    };
                }

                // Парсим группы
                let groups = [];
                const groupsElement = lessonInfo.querySelector('.schedule__groups');
                if (groupsElement) {
                    const groupLinks = groupsElement.querySelectorAll('.schedule__group');
                    if (groupLinks.length > 0) {
                        groupLinks.forEach(link => {
                            groups.push(link.innerText.trim());
                        });
                    } else {
                        groups.push(groupsElement.innerText.trim());
                    }
                }

                schedule.daysOfSchedule.push({
                    subject: subject || null,
                    place: place || null,
                    teacher: teacher, // Убрал JSON.stringify
                    groups: groups.length > 0 ? groups.join('    ') : null,
                    type: type || null
                });
            } else {
                schedule.daysOfSchedule.push({
                    subject: null
                });
            }
        }

        // Парсим время занятий
        for (let cell of root.querySelectorAll(".schedule__time")) {
            const timeText = cell.innerText.trim();
            if (timeText) {
                schedule.times.push(timeText);
            }
        }

        // Парсим информацию о группе
        const infoBlock = root.querySelector(".card-default.info-block");
        if (infoBlock) {
            const groupNumber = infoBlock.querySelector("h2.info-block__title")?.innerText.trim();
            const specialtyElement = infoBlock.querySelector(".info-block__description > div:first-child");
            const specialty = specialtyElement?.innerText.trim();
            const educationFormElement = infoBlock.querySelector(".info-block__description > div:nth-child(2)");
            const educationForm = educationFormElement?.innerText.trim();
            const yearStartElement = infoBlock.querySelector(".info-block__semester div");
            const yearStart = yearStartElement?.innerText.trim();

            schedule.groupInfo = {
                groupNumber: groupNumber || null,
                specialty: specialty || null,
                educationForm: educationForm || null,
                yearStart: yearStart || null
            };
        }

        schedule.currentWeek = root.querySelector(".week-nav-current_week")?.innerText.slice(1, 3).trim();
        res.json(schedule);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Failed to fetch schedule' });
    }
});

app.get('/api/schedule', async (req, res) => {
    const { id, type, week } = req.query;
    
    try {
        let url;
        if (type === 'group') {
            url = `https://ssau.ru/rasp?groupId=${id}`;
        } else if (type === 'teacher') {
            url = `https://ssau.ru/rasp?staffId=${id}`;
        } else {
            return res.status(400).json({ error: 'Invalid type' });
        }

        if (week) {
            url += `&selectedWeek=${week}`;
        }

        // Перенаправляем запрос в ваш парсер
        const raspUrl = url.replace('https://ssau.ru', '/api');
        const response = await axios.get(`http://localhost:${PORT}${raspUrl}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Failed to fetch schedule' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});