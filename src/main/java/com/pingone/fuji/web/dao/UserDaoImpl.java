/***************************************************************************
 * Copyright (C) 2012 Ping Identity Corporation
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
package com.pingone.fuji.web.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author dalvizu
 */
public class UserDaoImpl
    implements UserDao
{

    @Autowired
    private SessionFactory sessionFactory;
    
    public Session getSession()
    {
        return sessionFactory.getCurrentSession();
    }
    
    @Override
    public User findByEmail(String email)
    {
        return (User)getSession().createQuery("from User where email=:email").setString("email", email)
                .uniqueResult();
    }

    @Override
    public User findById(Long id)
    {
        return (User)getSession().createQuery("from User where id=:id").setLong("id", id)
                .uniqueResult();
    }

    @Override
    public void saveUser(User user)
    {
        getSession().saveOrUpdate(user);
    }

}