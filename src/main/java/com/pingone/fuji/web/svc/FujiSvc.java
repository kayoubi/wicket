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

import com.pingone.fuji.web.dto.UserDto;

/**
 * 
 * @author dalvizu
 */
public interface FujiSvc
{
    public String getCurrentDate();

    boolean isEmailTakenByAUser(String email);
    
    public void saveUser(UserDto userDto);
    
    public UserDto getUser(String email);
}
