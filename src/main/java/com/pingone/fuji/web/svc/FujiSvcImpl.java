/***************************************************************************
 * Copyright (C) 2013 Ping Identity Corporation
 * All rights reserved.
 * 
 * The contents of this file are the property of Ping Identity Corporation.
 * You may not copy or use this file, in either source code or executable
 * form, except in compliance with terms set by Ping Identity Corporation.
 * For further information please contact:
 * 
 *     Ping Identity Corporation
 *     1001 17th Street Suite 100
 *     Denver, CO 80202
 *     303.468.2900
 *     http://www.pingidentity.com
 * 
 **************************************************************************/
package com.pingone.fuji.web.svc;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.pingone.fuji.web.dao.User;
import com.pingone.fuji.web.dao.UserDao;
import com.pingone.fuji.web.dto.UserDto;

public class FujiSvcImpl
    implements FujiSvc
{
    @Autowired
    private UserDao userDao;
    
    @Override
    public String getCurrentDate()
    {
        return new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ").format(new Date());
    }
    
    @Transactional
    @Override
    public boolean isEmailTakenByAUser(String email)
    {
        return userDao.findByEmail(email) != null;
    }

    @Override
    public void saveUser(UserDto userDto)
    {
        User user = new User();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        userDao.saveUser(user);
    }

    @Transactional
    @Override
    public UserDto getUser(String email)
    {
        User user = userDao.findByEmail(email);
        UserDto userDto = new UserDto();
        userDto.setEmail(user.getEmail());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setPassword(user.getPassword()); // hashing passwords is hard - what are we, a digital identity company?
        userDto.setSpamBot(false);
        return userDto;
    }
}
