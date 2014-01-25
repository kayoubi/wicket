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
package com.pingone.fuji.web.dto;

import java.io.Serializable;

/**
 * @author dalvizu
 *
 */
public class UserDto
    implements Serializable
{
    
    private static final long serialVersionUID = -5076499823064937588L;

    private String firstName;
    
    private String lastName;
    
    private String email;
    
    private boolean spamBot;
    
    private String password;
    
    public String getFirstName()
    {
        return firstName;
    }

    public String getLastName()
    {
        return lastName;
    }

    public String getEmail()
    {
        return email;
    }

    public String getPassword()
    {
        return password;
    }

    public void setFirstName(String firstName)
    {
        this.firstName = firstName;
    }

    public void setLastName(String lastName)
    {
        this.lastName = lastName;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    public void setPassword(String password)
    {
        this.password = password;
    }

    public boolean isSpamBot()
    {
        return spamBot;
    }
    
    public void setSpamBot(boolean spamBot)
    {
        this.spamBot = spamBot;
    }

}
