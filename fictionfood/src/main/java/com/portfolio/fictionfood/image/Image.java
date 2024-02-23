package com.portfolio.fictionfood.image;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.domain.AbstractPersistable;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Getter
@Setter
public abstract class Image extends AbstractPersistable<Long> {

    private String name;

    private String type;

    @Column(columnDefinition = "bytea")
    private byte[] imageData;

    abstract void setLink(Object object);
}