package com.aukhtubut.uh2.attendance.services;

import com.aukhtubut.uh2.attendance.dtos.*;

public interface ScheduleService {
	
	public ScheduleDtoExtArray getSchedules();

	public PointageDtoExt markPresence(String student, String schedule);

	public ScheduleDtoExt getScheduleByName(String name);

	public ScheduleDtoExt createSchedule(ScheduleDto schedule);

	public ScheduleDtoExt updateSchedule(ScheduleDto schedule,String name);

	public void deleteSchedule(String name);

}
