package com.noahgeerts.progress.repository;

import org.springframework.data.repository.CrudRepository;

import com.noahgeerts.progress.domain.Session.Session;

public interface SessionRepository extends CrudRepository<Session, Long> {

}
