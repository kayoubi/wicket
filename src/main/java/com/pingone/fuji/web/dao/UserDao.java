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
package com.pingone.fuji.web.dao;


/**
 * @author dalvizu
 */
public interface UserDao
{
    public User findById(Long id);
    
    public User findByEmail(String email);
    
    public void saveUser(User user);
}
