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

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = { "email" }) })
public class User
    implements Serializable
{

    private static final long serialVersionUID = 4906364834150418499L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 128, nullable = false)
    private String email;
    
    @Column(length = 128)
    private String firstName;
    
    @Column(length = 128)
    private String lastName;
    
    @Column(length = 128)
    private String password;
    
    public void setId(Long id)
    {
        this.id = id;
    }
    
    public Long getId()
    {
        return id;
    }
    
    public void setEmail(String email)
    {
        this.email = email;
    }
    
    public String getEmail()
    {
        return email;
    }
    
    public String getFirstName()
    {
        return firstName;
    }

    public String getLastName()
    {
        return lastName;
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

    public void setPassword(String password)
    {
        this.password = password;
    }
}